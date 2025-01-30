import './about.css';
import BackgroundAnimation from '../components/backgroundAnimation';
import Nav from '../components/nav';
import teamLogo from '../assets/gadget_labs.svg';
import AboutCard from '../components/aboutCard';
import rick from '../assets/rick.png';
import fade from '../assets/fade.png';
import gojo from '../assets/gojo.png';
import ghost from '../assets/ghost2.png';

function About() {
    const teamMembers = [
        {
          name: "Prabal Bhardwaj",
          image: rick,
          qualifications: "Backend Developer",
          details:" Led the backend development using Java, implemented the chunk server in Go, and designed the secure file chunking and retrieval mechanism.",
          linkedinUrl: "https://www.linkedin.com/in/prabal-bhardwaj-500734315/",
          githubUrl: "https://github.com/Bhardwaj-Prabal"
        },
        {
          name: "Abhinav Parindiyal", 
          image: ghost,
          qualifications: "Frontend Developer",
          details: "Developed the frontend using React and collaborated on backend integration for seamless user interaction.",
          linkedinUrl: "https://www.linkedin.com/in/abhinav-parindiyal-ba983b25a/",
          githubUrl: "https://github.com/MrParindiyal"
        },
        {
          name: "Ranbeer Malhotra",
          image: gojo, 
          qualifications: "Frontend Developer",
          details: "Designed the frontend in React and assisted with backend integration to ensure a cohesive user journey.",
          linkedinUrl: "https://www.linkedin.com/in/ranbeer-malhotra-7912a3208/",
          githubUrl: "https://github.com/rnbr04"
        },
        {
          name: "Kanak",
          image: fade,
          qualifications: "Backend developer",
          details: "Worked on Java Spring Boot for backend development alongside Prabal and provided insights for promoting Torro Split.",
          linkedinUrl: "https://www.linkedin.com/in/kanak-rohj-95587a2bb/",
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