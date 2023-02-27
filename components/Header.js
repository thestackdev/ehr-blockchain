import React from "react";
import { Menu, Image } from "semantic-ui-react";
import { Link } from "../routes";
export default () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">
          <Image
            src="https://bafybeie724i7v2re4kdzktcfn35ymwgyep6y4lpckz2rpn4ctpcjfbidnm.ipfs.infura-ipfs.io/"
            style={{ maxWidth: "30px", maxHeight: "30px" }}
          />
        </a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/newdoc">
          <a className="item">Add doctor</a>
        </Link>
        <Link route="/all">
          <a className="item">Records</a>
        </Link>
        <Link route="/doctors">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
