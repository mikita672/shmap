package com.mdzvtt.shmap.validation;

import com.mdzvtt.shmap.chat.dto.SendChatMessageRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TextOrPlaceValidator implements ConstraintValidator<TextOrPlace, SendChatMessageRequest> {
    @Override
    public boolean isValid(SendChatMessageRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }
        boolean hasText = request.text() != null;
        boolean hasPlace = request.place() != null;
        if (hasText != hasPlace) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        if (hasText) {
            context.buildConstraintViolationWithTemplate("Send either a message or a place, not both")
                    .addPropertyNode("place")
                    .addConstraintViolation();
        } else {
            context.buildConstraintViolationWithTemplate("Send a message or a place")
                    .addPropertyNode("text")
                    .addConstraintViolation();
        }
        return false;
    }
}
