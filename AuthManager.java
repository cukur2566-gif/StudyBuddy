package control;

import entity.Student;
import entity.User;

import java.util.HashMap;
import java.util.Map;

public class AuthManager {
    private Map<String, User> users;

    public AuthManager() {
        users = new HashMap<>();
        // Predefined test users
        users.put("student1", new Student("student1", "pass123"));
    }

    public User validate(String username, String password) {
        User user = users.get(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}