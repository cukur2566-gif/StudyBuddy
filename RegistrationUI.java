package boundary;

import control.RegistrationManager;
import entity.Student;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class RegistrationUI {
    private Scanner scanner;
    private RegistrationManager regManager;

    public RegistrationUI() {
        this.scanner = new Scanner(System.in);
        this.regManager = new RegistrationManager();
    }

    public void startRegistration(Student student) {
        System.out.println("\n--- Course Registration ---");
        List<String> available = regManager.getAvailableCourses();
        System.out.println("Available courses:");
        for (int i = 0; i < available.size(); i++) {
            System.out.println((i + 1) + ". " + available.get(i));
        }

        System.out.println("Enter course numbers separated by commas (e.g., 1,3,5):");
        String input = scanner.nextLine();
        String[] selections = input.split(",");

        List<String> selected = new ArrayList<>();
        for (String s : selections) {
            try {
                int idx = Integer.parseInt(s.trim()) - 1;
                if (idx >= 0 && idx < available.size()) {
                    selected.add(available.get(idx));
                }
            } catch (NumberFormatException ignored) {}
        }

        if (selected.isEmpty()) {
            System.out.println("No valid courses selected.");
            return;
        }

        boolean success = regManager.register(student, selected);
        if (success) {
            System.out.println("Registration successful!");
            System.out.println("Your enrolled courses: " + student.getEnrolledCourses());
        } else {
            System.out.println(" Failed: You cannot register for more than 5 courses total.");
        }
    }
}