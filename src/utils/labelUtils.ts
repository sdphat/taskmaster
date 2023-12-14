export interface BackgroundTextColor {
  background: string;
  textColor: string;
  backgroundColorName: string;
}

export const bgTextColorPair: BackgroundTextColor[] = [
  {
    background: "#BAF3DB",
    textColor: "#1F845A",
    backgroundColorName: "subtle green",
  },
  {
    background: "#F8E6A0",
    textColor: "#946F00",
    backgroundColorName: "subtle yellow",
  },
  {
    background: "#FEDEC8",
    textColor: "#C25100",
    backgroundColorName: "subtle orange",
  },
  {
    background: "#FFD5D2",
    textColor: "#C9372C",
    backgroundColorName: "subtle red",
  },
  {
    background: "#DFD8FD",
    textColor: "#6E5DC6",
    backgroundColorName: "subtle purple",
  },
  {
    background: "#4BCE97",
    textColor: "#1F845A",
    backgroundColorName: "green",
  },
  {
    background: "#D3F1A7",
    textColor: "#5B7F24",
    backgroundColorName: "subtle lime",
  },
  {
    background: "#94C748",
    textColor: "#5B7F24",
    backgroundColorName: "lime",
  },
  {
    background: "#5B7F24",
    textColor: "#fff",
    backgroundColorName: "bold lime",
  },

  {
    background: "#1F845A",
    textColor: "#fff",
    backgroundColorName: "bold green",
  },

  {
    background: "#F87168",
    textColor: "#C9372C",
    backgroundColorName: "red",
  },
  {
    background: "#C9372C",
    textColor: "#fff",
    backgroundColorName: "bold red",
  },

  {
    background: "#FEA362",
    textColor: "#C25100",
    backgroundColorName: "orange",
  },
  {
    background: "#C25100",
    textColor: "#fff",
    backgroundColorName: "bold orange",
  },

  {
    background: "#F5CD47",
    textColor: "#946F00",
    backgroundColorName: "yellow",
  },
  {
    background: "#946F00",
    textColor: "#fff",
    backgroundColorName: "bold yellow",
  },
  {
    background: "#C6EDFB",
    textColor: "#227D9B",
    backgroundColorName: "subtle sky",
  },
  {
    background: "#6CC3E0",
    textColor: "#227D9B",
    backgroundColorName: "sky",
  },
  {
    background: "#227D9B",
    textColor: "#fff",
    backgroundColorName: "bold sky",
  },
  {
    background: "#CCE0FF",
    textColor: "#0C66E4",
    backgroundColorName: "subtle blue",
  },
  {
    background: "#579DFF",
    textColor: "#0C66E4",
    backgroundColorName: "blue",
  },
  {
    background: "#0C66E4",
    textColor: "#fff",
    backgroundColorName: "bolder blue",
  },

  {
    background: "#9F8FEF",
    textColor: "#6E5DC6",
    backgroundColorName: "purple",
  },
  {
    background: "#6E5DC6",
    textColor: "#fff",
    backgroundColorName: "bold purple",
  },
  {
    background: "#FDD0EC",
    textColor: "#AE4787",
    backgroundColorName: "subtle pink",
  },
  {
    background: "#E774BB",
    textColor: "#AE4787",
    backgroundColorName: "pink",
  },
  {
    background: "#AE4787",
    textColor: "#fff",
    backgroundColorName: "bold pink",
  },
  {
    background: "#DCDFE4",
    textColor: "#626F86",
    backgroundColorName: "subtle black",
  },
  {
    background: "#8590A2",
    textColor: "#fff",
    backgroundColorName: "black",
  },
  {
    background: "#626F86",
    textColor: "#fff",
    backgroundColorName: "bold black",
  },
];

export const getTextColor = (background: string) =>
  bgTextColorPair.find((pair) => pair.background === background);
