import * as _ from "lodash-es";
import * as React from "react";
import { Link } from "react-router-dom";
import { SearchIcon } from "@patternfly/react-icons";
import { Selector as SelectorKind } from "@openshift-console/dynamic-plugin-sdk";
import { selectorToString } from "../module/selector";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const Requirement: React.FC<RequirementProps> = ({
  kind,
  requirements,
  namespace = "",
}) => {
  // Strip off any trailing '=' characters for valueless selectors
  const requirementAsString = selectorToString(requirements)
    .replace(/=,/g, ",")
    .replace(/=$/g, "");
  const requirementAsUrlEncodedString = encodeURIComponent(requirementAsString);

  const to = namespace
    ? `/search/ns/${namespace}?kind=${kind}&q=${requirementAsUrlEncodedString}`
    : `/search/all-namespaces?kind=${kind}&q=${requirementAsUrlEncodedString}`;

  return (
    <div className="co-m-requirement">
      <Link
        className={`co-m-requirement__link co-text-${kind.toLowerCase()}`}
        to={to}
      >
        <SearchIcon className="co-m-requirement__icon co-icon-flex-child" />
        <span className="co-m-requirement__label">
          {requirementAsString.replace(/,/g, ", ")}
        </span>
      </Link>
    </div>
  );
};
Requirement.displayName = "Requirement";

export const Selector: React.FC<SelectorProps> = ({
  kind = "Pod",
  selector = {},
  namespace = undefined,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <div className="co-m-selector">
      {_.isEmpty(selector) ? (
        <p className="text-muted">{t("No selector")}</p>
      ) : (
        <Requirement
          kind={kind}
          requirements={selector}
          namespace={namespace}
        />
      )}
    </div>
  );
};
Selector.displayName = "Selector";

type RequirementProps = {
  kind: string;
  requirements: SelectorKind;
  namespace?: string;
};

type SelectorProps = {
  kind?: string;
  selector: SelectorKind;
  namespace?: string;
};
