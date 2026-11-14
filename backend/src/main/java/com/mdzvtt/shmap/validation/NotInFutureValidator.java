package com.mdzvtt.shmap.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.ZoneId;

public class NotInFutureValidator implements ConstraintValidator<NotInFuture, LocalDate> {
    private static final ZoneId EARLIEST_TODAY_ZONE = ZoneId.of("Pacific/Kiritimati");

    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext context) {
        return date == null || !date.isAfter(LocalDate.now(EARLIEST_TODAY_ZONE));
    }
}
