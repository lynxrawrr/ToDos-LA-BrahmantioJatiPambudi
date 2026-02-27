import { render } from "@testing-library/react";
import Tabs from "./Tabs";

describe("Tabs snapshot", () => {
  test("matches snapshot on default all tab", () => {
    const { asFragment } = render(
      <Tabs allCount={10} completedCount={3} value="all" onChange={() => {}} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot on completed tab", () => {
    const { asFragment } = render(
      <Tabs
        allCount={10}
        completedCount={3}
        value="completed"
        onChange={() => {}}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
