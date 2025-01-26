import './about.css';
import BackgroundAnimation from '../components/backgroundAnimation';
import Nav from '../components/nav';
import teamLogo from '../assets/gadget_labs.svg';
import AboutCard from '../components/aboutCard';

function About() {
    const teamMembers = [
        {
          name: "Prabal Bhardwaj",
          image: "/go.svg",
          qualifications: "CEO, Ph.D. in Computer Science",
          details: "20 years of industry experience",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe"
        },
        {
          name: "Abhinav Parindiyal", 
          image: "/java.svg",
          qualifications: "CTO, M.S. in Engineering",
          details: "Expert in AI and Machine Learning",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe"
        },
        {
          name: "Ranbeer Malhotra",
          image: "/Postgresql.svg", 
          qualifications: "Lead Designer, BFA",
          details: "Award-winning UX designer",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe"
        },
        {
          name: "Kanak",
          image: "/react.svg",
          qualifications: "Marketing Director, MBA",
          details: "Global marketing strategy expert",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe"
        }
      ];

  return (
    <>
    <Nav/>
    <BackgroundAnimation 
      imageUrl={teamLogo}
      opacity={0.1}
      animationDuration={90} /*render speed*/
      patternSize={120}
    >
      <div className="about-container">
      {teamMembers.map((member, index) => (
        <AboutCard 
          key={index}
          name={member.name}
          image={member.image}
          qualifications={member.qualifications}
          details={member.details}
          linkedinUrl={member.linkedinUrl}
          githubUrl={member.githubUrl}
        />
      ))}
    </div>
    </BackgroundAnimation>
    </>
  );
}

export default About;