import { ReactNode, useState } from "react";

export interface DropdownPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootPanel: PanelStackData<any>;
}

export interface PanelStackData<PanelType extends string> {
  title?: ReactNode;
  panelType: PanelType;
}

const usePanelStack = <PanelType extends string>({
  rootPanel,
}: DropdownPanelProps) => {
  const [panelStack, setPanelStack] = useState<PanelStackData<PanelType>[]>([
    rootPanel,
  ]);
  const currentPanel = panelStack[panelStack.length - 1];

  function goBack() {
    setPanelStack((panelStack) => {
      if (panelStack.length > 1) {
        return panelStack.slice(0, -1);
      }
      return panelStack;
    });
  }

  function pushPanel(data: { title?: string; panelType: PanelType }) {
    setPanelStack((panelStack) => panelStack.concat(data));
  }

  return { panelStack, currentPanel, goBack, pushPanel };
};

export default usePanelStack;
