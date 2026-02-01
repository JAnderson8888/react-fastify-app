import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Container, 
  Button, 
  ListGroup, 
  Spinner, 
  Alert 
} from "react-bootstrap";
import type { CelestialBody } from "../interfaces/interfaces";
import DatePickerInput from "../components/inputs/datepicker";
import { formatDate } from "../utils/helpers";

function List() {
  //used to keep track of what dates will be passed as params to the request
  const [searchParams, setSearchParams] = useSearchParams();
  //list of the response data from the api
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
  //the item that has been selected
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  //keep track of the sorting
  const [sortBy, setSortBy] = useState<string | null>(null);
  //used to keep track what date was selected
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  //list of accepted types for units
  const [unit, setUnit] = useState<"kilometers" | "meters" | "miles" | "feet">("kilometers");
  //shows the spinner when loading the info from the api request
  const [loading, setLoading] = useState(true);
  //shows the error block if there was an error when getting the data
  const [error, setError] = useState<string | null>(null);

  const START_DATE = searchParams.get("START_DATE");
  const END_DATE = searchParams.get("END_DATE");

  /**
   * description: sets the params for the api request
   */
  const handleDateSubmit = () => {
    if (!selectedDate) return;

    const end = new Date(selectedDate);
    end.setDate(end.getDate() + 7);

    setSearchParams({
      START_DATE: formatDate(selectedDate),
      END_DATE: formatDate(end),
    });
  };

  //this does the api request when the parameters change a fetches a new list. Would prefer to use fetchye but time was a factor.
  useEffect(() => {
    if (!START_DATE || !END_DATE) {
      setError("Missing START_DATE or END_DATE parameters");
      setLoading(false);
      return;
    }

    let url = `/api?START_DATE=${START_DATE}&END_DATE=${END_DATE}`;
    if (sortBy) {
      url += `&sort=${sortBy}`;
    }

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCelestialBodies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [START_DATE, END_DATE, sortBy]);

  //if loading then displays spinner
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  //if there is an error displays the error to the user
  if (error) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="d-flex w-100">
      {/* Sidebar */}
      <div className="bg-light border-end p-3 overflow-auto vh-100" style={{ width: "20%", minWidth: "200px" }}>
        <h5 className="mb-3">
          Celestial Bodies ({celestialBodies.length})
        </h5>
        {/* Buttons used for sorting */}
        <div className="d-flex flex-column gap-2 mb-3">
          <Button
            variant={sortBy === "size" ? "primary" : "outline-primary"}
            onClick={() => setSortBy(sortBy === "size" ? null : "size")}
          >
            Size
          </Button>
          <Button
            variant={sortBy === "closeness" ? "primary" : "outline-primary"}
            onClick={() => setSortBy(sortBy === "closeness" ? null : "closeness")}
          >
            Closeness
          </Button>
          <Button
            variant={sortBy === "velocity" ? "primary" : "outline-primary"}
            onClick={() => setSortBy(sortBy === "velocity" ? null : "velocity")}
          >
            Velocity
          </Button>
        </div>
        {/* List of all the different bodies being shown */}
        <ListGroup>
          {celestialBodies.map((body, index) => (
            <ListGroup.Item
              key={index}
              action
              active={selectedBody?.name === body.name}
              onClick={() => setSelectedBody(body)}
            >
              {body.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      {/* The date picker used to update the request and retrieve a new list */}
      <div className="flex-grow-1 p-3">
        <DatePickerInput
          selectedDate={selectedDate}
          label="Update the Date"
          onChange={(date: Date | null) => setSelectedDate(date)}
        />
        <Button className="mt-2 mb-3" onClick={handleDateSubmit} disabled={!selectedDate}>
          Search
        </Button>
        {/* Displays when an item is selected */}
        {selectedBody ? (
          <div className="border rounded p-3">
            <h3>{selectedBody.name}</h3>
            <h5 className="mt-3">Estimated Diameter</h5>
            {/* The buttons used to show what the value you is based on what type of measurement the user desires. */}
            <div className="d-flex gap-2 mb-3">
              <Button
                variant={unit === "kilometers" ? "primary" : "outline-primary"}
                onClick={() => setUnit("kilometers")}
              >
                Kilometers
              </Button>
              <Button
                variant={unit === "meters" ? "primary" : "outline-primary"}
                onClick={() => setUnit("meters")}
              >
                Meters
              </Button>
              <Button
                variant={unit === "miles" ? "primary" : "outline-primary"}
                onClick={() => setUnit("miles")}
              >
                Miles
              </Button>
              <Button
                variant={unit === "feet" ? "primary" : "outline-primary"}
                onClick={() => setUnit("feet")}
              >
                Feet
              </Button>
            </div>
            <p className="mb-1">
              {selectedBody.estimated_diameter[unit].estimated_diameter_min.toFixed(3)}{" "}
              -{" "}
              {selectedBody.estimated_diameter[unit].estimated_diameter_max.toFixed(3)}{" "}
              {unit}
            </p>
            {selectedBody.close_approach_data[0] && (
              <>
                <h5 className="mt-3">Close Approach Data</h5>
                <p className="mb-1">
                  Date: {selectedBody.close_approach_data[0].close_approach_date}
                </p>
                <p className="mb-1">
                  Miss Distance:{" "}
                  {parseFloat(selectedBody.close_approach_data[0].miss_distance.kilometers).toLocaleString()}{" "}
                  km ({selectedBody.close_approach_data[0].miss_distance.lunar}{" "}
                  lunar)
                </p>
                <p className="mb-1">
                  Velocity:{" "}
                  {parseFloat(selectedBody.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)}{" "}
                  km/s
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-muted mt-5">
            <p>Select a celestial body from the sidebar to view its details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
