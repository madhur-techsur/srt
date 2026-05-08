## Y0: Database Schema

**Storage Engine:** H2 in-memory database, embedded in Spring Boot JVM via `spring-boot-starter-data-jpa` and H2 auto-configuration. Schema is auto-created by Hibernate DDL on application startup. Data is lost on application restart (demo scope; no persistence durability required).

---

### §requests — Core Request Table

This is the only table in the SRT system.

**DDL (H2-compatible SQL):**

```sql
CREATE TABLE requests (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    description VARCHAR(1000)   NOT NULL,
    created_at  TIMESTAMP       NOT NULL,
    CONSTRAINT pk_requests PRIMARY KEY (id)
);
```

**Column Definitions:**

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | System-assigned unique identifier |
| `name` | VARCHAR(255) | NO | NOT NULL | Requester's name (trimmed before insert) |
| `title` | VARCHAR(255) | NO | NOT NULL | Short request title (trimmed before insert) |
| `description` | VARCHAR(1000) | NO | NOT NULL | Full request description (trimmed before insert) |
| `created_at` | TIMESTAMP | NO | NOT NULL | UTC timestamp of record creation (server-assigned) |

**Notes:**
- No foreign keys (single-table system).
- No soft-delete; records are never deleted in demo scope.
- No indexes beyond the primary key (demo scope; single-user, no performance requirements).
- `created_at` is set by the Java service layer (`Instant.now()`) before the entity is persisted; not derived from a database default.

---

### §Spring Boot JPA Entity Mapping

**Java Entity Class:** `Request`

```java
@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // Constructors, getters, setters omitted for brevity
}
```

**Repository Interface:**

```java
public interface RequestRepository extends JpaRepository<Request, Long> {
    // findAll() from JpaRepository returns all records in insertion order (by id ASC)
}
```

---

### §Spring Boot application.properties (H2 Configuration)

```properties
# H2 In-Memory Datasource
spring.datasource.url=jdbc:h2:mem:srtdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# H2 Console (for dev debugging only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

**Notes:**
- `DB_CLOSE_DELAY=-1` keeps the H2 database open as long as the JVM is running.
- `ddl-auto=create-drop` creates the schema on startup and drops it on shutdown.
- H2 console is enabled for development debugging at `/h2-console`.

---

### §Request DTO (Inbound Deserialization)

```java
public class RequestDto {
    private String name;
    private String title;
    private String description;

    // Getters and setters
}
```

### §Request Response JSON Shape

The serialized `Request` entity returned in API responses:

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "title": "New desk required",
  "description": "I need a standing desk for ergonomic reasons.",
  "createdAt": "2026-05-08T14:00:00Z"
}
```

**Serialization Notes:**
- `id` serialized as JSON number (integer).
- `createdAt` serialized as ISO 8601 UTC string via `@JsonSerialize` / Jackson `JavaTimeModule`.
- Jackson should be configured with `WRITE_DATES_AS_TIMESTAMPS=false` to ensure ISO 8601 string output.
