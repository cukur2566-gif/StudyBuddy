package control;

import entity.BillingSystem;
import entity.Course;
import entity.Student;

import java.util.List;

public class RegistrationManager {

    public boolean register(Student student, List<String> selectedCourses) {
        if (!student.canEnroll(selectedCourses.size())) {
            return false;
        }
        for (String course : selectedCourses) {
            student.addCourse(course);
        }
        BillingSystem.notifyRegistration(student.getUsername(), selectedCourses);
        return true;
    }

    public List<String> getAvailableCourses() {
        return Course.getAvailableCourses();
    }
}