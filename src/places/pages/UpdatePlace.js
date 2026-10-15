import React, { useEffect, useState, useContext } from "react";

import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [identifiedPlace, setIdentifiedPlace] = useState();
  const history = useHistory();
  const { placeId } = useParams();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    true,
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        );
        setIdentifiedPlace(response.place);
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true,
            },
            description: {
              value: response.place.description,
              isValid: true,
            },
          },
          true,
        );
      } catch (error) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const updatePlaceSubmiteHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      );

      history.push("/" + auth.userId + "/places");
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!identifiedPlace && !error) {
    return (
      <Card className="center">
        <h2>Could not find place!</h2>
      </Card>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && identifiedPlace && (
        <form className="place-form" onSubmit={updatePlaceSubmiteHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={identifiedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description."
            onInput={inputHandler}
            initialValue={identifiedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
