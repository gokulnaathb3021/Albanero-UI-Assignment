"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

type StringObject = {
  [key: string]: string;
};
export default function Home() {
  const [customForm, setCustomForm] = useState<JSX.Element[] | []>([]);
  const [formElementsIds, setFormElementsIds] = useState<string[] | []>([]);
  const [formData, setFormData] = useState<StringObject[] | []>([]);
  const [formDetails, setFormDetails] = useState<StringObject>({});
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLInputElement>(null);

  const emptyTheFormBuilderFields = () => {
    const fieldNameInput = document.getElementById(
      "fieldName"
    ) as HTMLInputElement;
    if (fieldNameInput.value !== "") fieldNameInput.value = "";

    const selectOptionsInput = document.getElementById(
      "optionList"
    ) as HTMLInputElement;
    if (selectOptionsInput.value !== "") selectOptionsInput.value = "";
  };

  const emptyTheFormFields = () => {
    setFormDetails((prevFormDetails) => {
      const emptyForm: StringObject = {};
      Object.keys(prevFormDetails).forEach((k) => {
        emptyForm[k] = "";
      });

      return emptyForm;
    });

    for (let i = 0; i < formElementsIds.length; i += 1) {
      const element = document.getElementById(formElementsIds[i]);
      if (element?.tagName === "SELECT") {
        const selectElement = element as HTMLSelectElement;
        selectElement.value = "";
      } else {
        const inputElement = element as HTMLInputElement;
        inputElement.value = "";
      }
    }
  };

  const addInput = () => {
    if (inputFieldRef.current?.value === "") {
      toast.error("Field's name can't be empty!");
      return;
    }
    if (inputFieldRef.current?.value) {
      const fieldName = inputFieldRef.current?.value.trim();
      if (fieldName === "") {
        toast.error("Field's name can't be empty!");
        return;
      }
      for (let i = 0; i < formElementsIds.length; i += 1)
        if (fieldName === formElementsIds[i]) {
          toast.error(
            "A form element with this field name already exists in the custom form!"
          );
          return;
        }
      setCustomForm((prevCustomForm) => {
        const cF: JSX.Element[] | null = [...prevCustomForm];
        cF.push(
          <div key={fieldName} className={styles.customElement}>
            <Label htmlFor={fieldName}>{fieldName}</Label>
            <Input
              value={formDetails[fieldName]}
              id={fieldName}
              onChange={(e) => {
                setFormDetails((prevFormDetails) => {
                  return { ...prevFormDetails, [fieldName]: e.target.value };
                });
              }}
            ></Input>
          </div>
        );
        return cF;
      });

      setFormDetails((prevFormDetails) => {
        return { ...prevFormDetails, [fieldName]: "" };
      });

      emptyTheFormBuilderFields();

      setFormElementsIds((prevFormElementsIds) => {
        const fEIds = [...prevFormElementsIds];
        fEIds.push(fieldName);
        return fEIds;
      });
    }
    toast.success("Form element added to your custom form!");
  };

  const addSelect = () => {
    if (inputFieldRef.current?.value === "") {
      toast.error("Field's name can't be empty!");
      return;
    }
    if (inputFieldRef.current?.value) {
      const fieldName = inputFieldRef.current?.value.trim();
      if (fieldName === "") {
        toast.error("Field's name can't be empty!");
        return;
      }
      for (let i = 0; i < formElementsIds.length; i += 1)
        if (fieldName === formElementsIds[i]) {
          toast.error(
            "A form element with this field name already exists in the custom form!"
          );
          return;
        }
      if (selectRef.current?.value === "") {
        toast.error("Option list can't be empty!");
        return;
      }
      if (selectRef.current?.value) {
        const values: string[] = selectRef.current.value.trim().split(",");
        if (values.length === 0) {
          toast.error("Option list can't be empty!");
          return;
        }
        setCustomForm((prevCustomForm) => {
          const cF: JSX.Element[] | null = [...prevCustomForm];
          cF.push(
            <div key={fieldName} className={styles.select}>
              <Label htmlFor={fieldName}>{fieldName}</Label>
              <select id={fieldName} className={styles.selectElement}>
                <option value="" disabled selected hidden>
                  Select an option
                </option>
                {values.map((val) => (
                  <option key={val}>{val}</option>
                ))}
              </select>
            </div>
          );
          return cF;
        });

        setFormDetails((prevFormDetails) => {
          return { ...prevFormDetails, [fieldName]: "" };
        });
      }

      emptyTheFormBuilderFields();

      setFormElementsIds((prevFormElementsIds) => {
        const fEIds = [...prevFormElementsIds];
        fEIds.push(fieldName);
        return fEIds;
      });
    }
    toast.success("Form element added to your custom form!");
  };

  const saveDetails = (e: React.FormEvent) => {
    e.preventDefault();

    for (let i = 0; i < formElementsIds.length; i += 1) {
      const element = document.getElementById(formElementsIds[i]);
      if (element?.tagName === "SELECT") {
        const selectElement = element as HTMLSelectElement;
        const val = selectElement.value;
        formDetails[formElementsIds[i]] = val;
      }
    }
    for (const key in formDetails) {
      if (!formDetails[key]) {
        toast.error(`${key} can't be empty`);
        return;
      }
    }
    setFormData((prevFormData) => {
      const fD = [...prevFormData];
      fD.push({ ...formDetails, id: v4() });
      return fD;
    });

    emptyTheFormFields();
    toast.success(
      'Details added, have a look at the "FORM DETAILS" section of the page.',
      { duration: 5000 }
    );
  };

  const renderData = (fD: StringObject) => {
    const { id, ...data } = fD;
    console.log(fD);
    return (
      <Card className={styles.card}>
        <CardContent>
          <pre>{JSON.stringify(data, undefined, 4)}</pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={styles.customForm}>
      <Header />
      {/*  */}
      <div className={styles.actionsSection}>
        <h1>ACTIONS</h1>
        <div className={styles.actions}>
          <div className={styles.action}>
            <div className={styles.labelAndInput}>
              <Label htmlFor="fieldName">
                LABEL FOR THE FIELD YOU WANT TO ADD
              </Label>
              <Input
                id="fieldName"
                placeholder="label"
                ref={inputFieldRef}
              ></Input>
            </div>
            <Button onClick={addInput}>Add input box</Button>
            {/* <button onClick={addInput}>Add input box</button> */}
          </div>
          <div className={styles.action}>
            <div className={styles.labelAndInput}>
              <Label htmlFor="optionList">OPTION LIST IN SELECT DROPDOWN</Label>
              <Input
                id="optionList"
                placeholder="comma separated values"
                ref={selectRef}
              ></Input>
            </div>
            <Button onClick={addSelect}>Add select box</Button>
          </div>
        </div>
      </div>

      {/*  */}
      <div className={styles.cForm}>
        {customForm.length !== 0 && <h1>YOUR CUSTOM FORM</h1>}
        <form>
          {customForm}
          {customForm.length !== 0 && (
            <Button type="submit" onClick={saveDetails}>
              Save
            </Button>
          )}
        </form>
      </div>
      {/*  */}
      <div className={styles.display}>
        {formData.length !== 0 && <h1>FORM DETAILS</h1>}
        <div className={styles.values}>
          {formData.map((fD) => (
            <div key={fD["id"]}>{renderData(fD)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
