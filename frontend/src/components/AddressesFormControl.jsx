import React from "react";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  enter: 13,
};

const delimiters = [KeyCodes.enter];

const AddressesFormControl = ({ addresses, setAddresses }) => {
  const handleDelete = (i) => {
    setAddresses(addresses.filter((address, index) => index !== i));
  };

  const handleAddition = (address) => {
    setAddresses([...addresses, address]);
  };

  const handleDrag = (address, currPos, newPos) => {
    const addressesCopy = [...addresses];
    const newAddresses = addressesCopy.slice();

    newAddresses.splice(currPos, 1);
    newAddresses.splice(newPos, 0, address);

    setAddresses(newAddresses);
  };

  return (
    <>
      <label htmlFor="addresses" className="form-label">
        Addresses
      </label>
      <ReactTags
        inputFieldPosition="bottom"
        placeholder={"Press enter to add a new address"}
        tags={addresses}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        delimiters={delimiters}
      />
    </>
  );
};

export default AddressesFormControl;
