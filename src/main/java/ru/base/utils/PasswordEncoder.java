package ru.base.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoder {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        System.out.println(encoder.encode("d1857s"));
        System.out.println(encoder.encode("m8639r"));
        System.out.println(encoder.encode("s4021q"));

        System.out.println(encoder.encode("fin18"));
        System.out.println(encoder.encode("buh18"));

    }
}
