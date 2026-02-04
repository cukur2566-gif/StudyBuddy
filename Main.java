import boundary.LoginUI;
import boundary.RegistrationUI;
import entity.Student;
import entity.User;

public class Main {
    public static void main(String[] args) {
        System.out.println("Course Registration System (CRS)");
        System.out.println("==================================");

        LoginUI loginUI = new LoginUI();
        User user = loginUI.showLogin();

        if ("student".equals(user.getRole())) {
            RegistrationUI regUI = new RegistrationUI();
            regUI.startRegistration((Student) user);
        } else {
            System.out.println("Welcome, " + user.getRole() + "! (Registration only for students.)");
        }

        System.out.println("\nThank you for using CRS!");
    }
}