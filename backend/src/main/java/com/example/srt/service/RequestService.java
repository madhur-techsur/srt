package com.example.srt.service;

import com.example.srt.exception.ValidationException;
import com.example.srt.exception.ValidationException.FieldError;
import com.example.srt.model.Request;
import com.example.srt.model.RequestDto;
import com.example.srt.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class RequestService {

    private final RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public Request createRequest(RequestDto dto) {
        // Service-layer validation — collect ALL errors before throwing (not fail-fast)
        List<FieldError> errors = new ArrayList<>();

        if (dto.getName() == null || dto.getName().isBlank()) {
            errors.add(new FieldError("name", "must not be blank"));
        }
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            errors.add(new FieldError("title", "must not be blank"));
        }
        if (dto.getDescription() == null || dto.getDescription().isBlank()) {
            errors.add(new FieldError("description", "must not be blank"));
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        // createdAt set via Instant.now() — per locked decision
        Request request = new Request(dto.getName(), dto.getTitle(), dto.getDescription(), Instant.now());
        return requestRepository.save(request);
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
}
