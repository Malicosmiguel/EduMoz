import { Link } from "react-router-dom";
import "./CourseCard.css";

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} />
      <div className="card-content">
        <h3>{course.title}</h3>
        <p className="instructor">{course.instructor}</p>
        <div className="meta">
          <span>{course.duration}</span>
          <span className="level">{course.level}</span>
        </div>
        <Link to={`/curso/${course.id}`} className="btn">
          Ver Curso
        </Link>
      </div>
    </div>
  );
}