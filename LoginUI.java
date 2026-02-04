package boundary;

import control.AuthManager;
import entity.User;

import java.util.Scanner;

public class LoginUI {
    private Scanner scanner;
    private AuthManager authManager;

    public LoginUI() {
        this.scanner = new Scanner(System.in);
        this.authManager = new AuthManager();
    }

    public User showLogin() {
        while (true) {
            System.out.print("Username: ");
            String username = scanner.nextLine();
            System.out.print("Password: ");
            String password = scanner.nextLine();

            User user = authManager.validate(username, password);
            if (user != null) {
                System.out.println(" Login successful! Welcome, " + user.getUsername());
                return user;
            } else {
                System.out.println(" Invalid credentials. Please try again.");
            }
        }
    }
}