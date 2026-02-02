import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { formatDate } from "../utils/helpers";
import DatePickerInput from "../components/inputs/datepicker";

function Home() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (!selectedDate) return;

    const start = formatDate(selectedDate);
    const end = new Date(selectedDate);
    end.setDate(end.getDate() + 7);
    navigate(
      `/list?START_DATE=${start}&END_DATE=${formatDate(end)}`,
    );
  };

  //Made this simple because I did not want to waste time and didn't have a plan. Just simple instructions.
  return (
    <Container className="mx-auto mt-5">
      {/* title */}
      <h1 className="p-2 my-3">Close Encounters</h1>
      {/* subtitle */}
      <p className="p-2 mb-3">
        Add a date you wish to see the celestial bodies that had come close to
        earth.
      </p>
      {/* Date Picker input */}
      <DatePickerInput
        selectedDate={selectedDate}
        label="Select a Date"
        onChange={(date: Date | null) => setSelectedDate(date)}
      />
      {/* Button to move forward */}
      <Button onClick={handleSubmit} disabled={!selectedDate}>
        Search
      </Button>
    </Container>
  );
}

export default Home;
