import * as React from "react";
import * as _ from "lodash";
import { getObjectItemFieldName } from "components/shared/formik-utils";
import { Remediator } from "data/types";
import { FormViewFieldProps } from "../propTypes";
import InputField from "copiedFromConsole/formik-fields/InputField";
import {
  getRemediatorFieldName,
  getRemediatorTemplateFieldName,
  useIsSNR,
} from "../remediatorFieldUtils";
import RemediatorKindField from "./RemediatorKindField";
import { useField } from "formik";
import { useFormikValidationFix } from "copiedFromConsole/hooks/formik-validation-fix";

const sentenceCase = (string: string) => {
  return _.capitalize(_.startCase(string));
};

const CustomRemediatorField = ({ fieldName }: FormViewFieldProps) => (
  <>
    {["apiVersion", "kind", "name", "namespace"].map((subFieldName) => {
      const inputFieldName = getObjectItemFieldName([fieldName, subFieldName]);
      return (
        <InputField
          required
          name={inputFieldName}
          key={inputFieldName}
          label={sentenceCase(subFieldName)}
        ></InputField>
      );
    })}
  </>
);

export const RemediatorField_: React.FC<{
  formViewFieldName: string;
  snrTemplatesExist: boolean;
}> = ({ formViewFieldName, snrTemplatesExist }) => {
  const [value] = useField<Remediator>(
    getRemediatorFieldName(formViewFieldName)
  );
  useFormikValidationFix(value);
  const templateFieldName = getRemediatorTemplateFieldName(formViewFieldName);
  const isSNR = useIsSNR(formViewFieldName);
  return (
    <>
      <RemediatorKindField
        formViewFieldName={formViewFieldName}
        snrTemplatesExist={snrTemplatesExist}
      />
      {!isSNR && (
        <CustomRemediatorField
          fieldName={templateFieldName}
        ></CustomRemediatorField>
      )}
    </>
  );
};

const RemediatorField = RemediatorField_;
export default RemediatorField;
