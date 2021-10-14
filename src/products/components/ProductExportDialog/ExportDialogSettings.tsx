import Hr from "@saleor/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import { ExportErrorFragment } from "@saleor/fragments/types/ExportErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import {
  ExportProductsInput,
  ExportScope,
  FileTypesEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getExportErrorMessage from "@saleor/utils/errors/export";
import React from "react";
import { useIntl } from "react-intl";

import { ExportSettingsInput } from "./types";

const useStyles = makeStyles(
  theme => ({
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3)
    }
  }),
  {
    name: "ExportDialogSettings"
  }
);

export type ExportItemsQuantity = Record<"all" | "filter", number>;

export interface ExportDialogSettingsProps {
  data: ExportSettingsInput;
  errors: ExportErrorFragment[];
  itemsQuantity: ExportItemsQuantity;
  selectedItems: number;
  exportTypeLabel: string;
  onChange: (event: ChangeEvent) => void;
}

const formFields: Array<keyof ExportSettingsInput> = ["fileType", "scope"];

const ExportDialogSettings: React.FC<ExportDialogSettingsProps> = ({
  data,
  errors,
  onChange,
  itemsQuantity,
  selectedItems,
  exportTypeLabel
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formErrors = getFormErrors(formFields, errors);

  const productsToExportChoices: Array<RadioGroupFieldChoice<ExportScope>> = [
    {
      label: intl.formatMessage(
        {
          defaultMessage: "All {exportTypeLabel} ({number})",
          description: "export all items to csv file"
        },
        {
          number: itemsQuantity.all || "...",
          exportTypeLabel
        }
      ),
      value: ExportScope.ALL
    },
    {
      disabled: selectedItems === 0,
      label: intl.formatMessage(
        {
          defaultMessage: "Selected {exportTypeLabel} ({number})",
          description: "export selected items to csv file"
        },
        {
          number: selectedItems,
          exportTypeLabel
        }
      ),
      value: ExportScope.IDS
    },
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Current search ({number})",
          description: "export filtered items to csv file"
        },
        {
          number: itemsQuantity.filter || "..."
        }
      ),
      value: ExportScope.FILTER
    }
  ];

  const productExportTypeChoices: Array<RadioGroupFieldChoice<
    FileTypesEnum
  >> = [
    {
      label: intl.formatMessage({
        defaultMessage: "Spreadsheet for Excel, Numbers etc.",
        description: "export items as spreadsheet"
      }),
      value: FileTypesEnum.XLSX
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Plain CSV file",
        description: "export items as csv file"
      }),
      value: FileTypesEnum.CSV
    }
  ];

  return (
    <>
      <RadioGroupField
        choices={productsToExportChoices}
        error={!!formErrors.scope}
        hint={getExportErrorMessage(formErrors.scope, intl)}
        label={intl.formatMessage({
          defaultMessage: "Export information for:",
          description: "export items to csv file, choice field label"
        })}
        name={"scope" as keyof ExportProductsInput}
        onChange={onChange}
        value={data.scope}
      />
      <Hr className={classes.hr} />
      <RadioGroupField
        choices={productExportTypeChoices}
        error={!!formErrors.fileType}
        hint={getExportErrorMessage(formErrors.fileType, intl)}
        label={intl.formatMessage({
          defaultMessage: "Export as:",
          description: "export items as csv or spreadsheet file"
        })}
        name={"fileType" as keyof ExportProductsInput}
        onChange={onChange}
        value={data.fileType}
      />
    </>
  );
};

export default ExportDialogSettings;