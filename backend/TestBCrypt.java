import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password123";
        String hash = "$2a$10$dXJ3SW6G7P50eS3xesY8fuZO2Ew7HkOFe1v5DswQxr9E.6AZXf7aG";
        
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Hash from DB: " + hash);
        System.out.println("Match result: " + encoder.matches(rawPassword, hash));
    }
}
