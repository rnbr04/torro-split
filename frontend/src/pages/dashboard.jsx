import { useRef } from 'react';
import './dashboard.css';
import BackgroundAnimation from '../components/backgroundAnimation';
import Nav from '../components/nav';
import SearchBox from '../components/SearchBox';
import ScrollableList from "../components/ScrollableList";
import teamLogo from '../assets/gadget_labs.svg';


const items = [
  { name: "Document1.pdx", uploadedOn: "Jan 15, 2025", size: "2 MB" },
  { name: "Presentation2.txt", uploadedOn: "Jan 14, 2025", size: "5 MB" },
  { name: "Spreadsheet3.xlsx", uploadedOn: "Jan 13, 2025", size: "1 MB" },
  { name: "Image4.webp", uploadedOn: "Jan 12, 2025", size: "3 MB" },
  { name: "Video5.mkv", uploadedOn: "Jan 11, 2025", size: "15 MB" },
  { name: "Document1.pdx", uploadedOn: "Jan 15, 2025", size: "2 MB" },
  { name: "Presentation2.txt", uploadedOn: "Jan 14, 2025", size: "5 MB" },
  { name: "Spreadsheet3.xlsx", uploadedOn: "Jan 13, 2025", size: "1 MB" },
  { name: "Image4.webp", uploadedOn: "Jan 12, 2025", size: "3 MB" },
  { name: "Video5.mkv", uploadedOn: "Jan 11, 2025", size: "15 MB" },
];

function Dashboard() {
  return (
    <>
      <Nav/>
      <BackgroundAnimation imageUrl={teamLogo} opacity={0.03} animationDuration={150} /*render speed*/patternSize={100}>
      <div className='content' id='dashboardcontent'>
      <div className="container" id="dashboard">
      <SearchBox/>
      <ScrollableList items={items} />
      </div>
      </div>
      </BackgroundAnimation>
    </>
  )
}

export default Dashboard;