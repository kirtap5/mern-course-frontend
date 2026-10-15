import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`,
        );
        setPlaces(response.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDelectedHandler = (deletedPlaceId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId),
    );
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && places && (
        <PlaceList items={places} onDeletePlace={placeDelectedHandler} />
      )}
    </>
  );
};

export default UserPlaces;
