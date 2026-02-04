package entity;

import java.util.List;

public class BillingSystem {
    public static void notifyRegistration(String studentId, List<String> courses) {
        System.out.println("[Billing System] Notification: Student " + studentId 
            + " registered in: " + courses);
    }
}