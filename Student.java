package entity;

import java.util.ArrayList;
import java.util.List;

public class Student extends User {
    private List<String> enrolledCourses;
    private static final int MAX_COURSES = 5;

    public Student(String username, String password) {
        super(username, password, "student");
        this.enrolledCourses = new ArrayList<>();
    }

    public boolean canEnroll(int additionalCourses) {
        return enrolledCourses.size() + additionalCourses <= MAX_COURSES;
    }

    public void addCourse(String courseCode) {
        enrolledCourses.add(courseCode);
    }

    public List<String> getEnrolledCourses() {
        return new ArrayList<>(enrolledCourses);
    }
}