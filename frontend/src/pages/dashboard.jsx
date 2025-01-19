import { useRef } from 'react';
import './dashboard.css';
import Nav from '../components/nav';
import SearchBox from '../components/SearchBox';
import ScrollableList from "../components/ScrollableList";

const items = [
  { name: "Document 1", uploadedOn: "Jan 15, 2025", size: "2 MB" },
  { name: "Presentation 2", uploadedOn: "Jan 14, 2025", size: "5 MB" },
  { name: "Spreadsheet 3", uploadedOn: "Jan 13, 2025", size: "1 MB" },
  { name: "Image 4", uploadedOn: "Jan 12, 2025", size: "3 MB" },
  { name: "Video 5", uploadedOn: "Jan 11, 2025", size: "15 MB" },
];

function Dashboard() {
  return (
    <>
      <Nav/>
      <SearchBox/>
      <ScrollableList items={items} />
    </>
  )
}

export default Dashboard;