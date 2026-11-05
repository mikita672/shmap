package com.mdzvtt.shmap.validation;

import com.mdzvtt.shmap.route.dto.UpdateRouteRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NameOrTravelModeValidator implements ConstraintValidator<NameOrTravelMode, UpdateRouteRequest> {
    @Override
    public boolean isValid(UpdateRouteRequest request, ConstraintValidatorContext context) {
        if (request == null || request.name() != null || request.travelMode() != null) {
            return true;
        }
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                .addPropertyNode("name")
                .addConstraintViolation();
        return false;
    }
}
