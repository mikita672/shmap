package com.mdzvtt.shmap.auth.passwordreset;

import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;

@Service
public class EmailService {
    private final Resend resend;

    public EmailService(Resend resend) {
        this.resend = resend;
    }

    public void sendOtpEmail(String recipientEmail, String otp) throws Exception {
        CreateEmailOptions options = CreateEmailOptions.builder()
                .from("Acme <onboarding@resend.dev>")
                .to(recipientEmail)
                .subject("Your Password Reset Code")
                .text("Your password reset code is: " + otp + ". It expires in 15 minutes")
                .build();

        try {
            resend.emails().send(options);
        } catch (Exception e) {
            throw new Exception("Failed to send otp code");
        }
    }
}
