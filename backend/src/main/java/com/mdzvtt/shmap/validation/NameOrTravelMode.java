package com.mdzvtt.shmap.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = NameOrTravelModeValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NameOrTravelMode {
    String message() default "Send a name or a travel mode";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
