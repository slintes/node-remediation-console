import * as _ from "lodash";
import { NodeAddress, NodeCondition, NodeKind } from "../types/node";

const NODE_ROLE_PREFIX = "node-role.kubernetes.io/";

export const getNodeRoles = (node: NodeKind): string[] => {
  const labels = _.get(node, "metadata.labels");
  return _.reduce(
    labels,
    (acc: string[], v: string, k: string) => {
      if (k.startsWith(NODE_ROLE_PREFIX)) {
        acc.push(k.slice(NODE_ROLE_PREFIX.length));
      }
      return acc;
    },
    []
  );
};

export const getNodeRole = (node: NodeKind): string =>
  getNodeRoles(node).includes("master") ? "master" : "worker";

export const getNodeRolesText = (node: NodeKind): string => {
  return getNodeRoles(node).sort().join(", ") ?? "-";
};

export const getNodeAddresses = (node: NodeKind): NodeAddress[] =>
  _.get(node, "status.addresses", []);

type NodeMachineAndNamespace = {
  name: string;
  namespace: string;
};
export const getNodeMachineNameAndNamespace = (
  node: NodeKind
): NodeMachineAndNamespace => {
  const machine = _.get(
    node,
    'metadata.annotations["machine.openshift.io/machine"]',
    "/"
  );
  const [namespace, name] = machine.split("/");
  return { namespace, name };
};

export const getNodeMachineName = (node: NodeKind): string =>
  getNodeMachineNameAndNamespace(node).name;

export const isNodeUnschedulable = (node: NodeKind): boolean =>
  _.get(node, "spec.unschedulable", false);

export const isNodeReady = (node: NodeKind): boolean => {
  const conditions = _.get(node, "status.conditions", []);
  const readyState = _.find(conditions, { type: "Ready" }) as NodeCondition;

  return readyState && readyState.status === "True";
};

export const getNodeCPUCapacity = (node: NodeKind): string =>
  _.get(node.status, "capacity.cpu");

export const getNodeAllocatableMemory = (node: NodeKind): string =>
  _.get(node.status, "allocatable.memory");

export const getNodeTaints = (node: NodeKind) => node?.spec?.taints;

export const isWindowsNode = (node) =>
  node?.metadata?.labels?.["node.openshift.io/os_id"] === "Windows" ||
  node?.metadata?.labels?.["corev1.LabelOSStable"] === "windows";

export const getNodeWorkerLabel = () => NODE_ROLE_PREFIX + "worker";
