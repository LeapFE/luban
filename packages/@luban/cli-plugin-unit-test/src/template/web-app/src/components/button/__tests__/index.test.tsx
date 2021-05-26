import React from "react";
import { render, mount } from "enzyme";
import renderer from "react-test-renderer";

import { Button } from "..";

function mountTest(Component: React.ComponentType): void {
  describe("mount and unmount", () => {
    it("component could be updated and unmounted without errors", () => {
      const wrapper = mount(<Component />);
      expect(() => {
        wrapper.setProps({});
        wrapper.unmount();
      }).not.toThrow();
    });
  });
}

describe("Button", () => {
  mountTest(Button);
  mountTest(() => <Button scale="big" />);
  mountTest(() => <Button scale="small" />);

  it("renders correctly", () => {
    const wrapper = render(<Button>Follow</Button>);
    expect(wrapper).toMatchSnapshot();
  });

  it("mount correctly", () => {
    expect(() => renderer.create(<Button>Follow</Button>)).not.toThrow();
  });
});
