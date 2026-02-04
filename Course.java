package entity;

import java.util.Arrays;
import java.util.List;

public class Course {
    public static List<String> getAvailableCourses() {
        return Arrays.asList("CS101", "MATH101", "ENG101", "PHYS101", "HIST101");
    }
}