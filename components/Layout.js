import { createMedia } from "@artsy/fresnel";
import Head from "next/head";
import Link from "next/link";
import React, { Component } from "react";
import {
  Button,
  Container,
  Menu,
  Segment,
  Visibility,
} from "semantic-ui-react";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

class Layout extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });
  render() {
    const { fixed } = this.state;
    return (
      <Media greaterThan="mobile">
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
            integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ=="
            crossOrigin="anonymous"
          />
        </Head>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 0, padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Link href="/" legacyBehavior>
                  <Menu.Item as="a">Home</Menu.Item>
                </Link>
                <Link href="/all" legacyBehavior>
                  <Menu.Item as="a">Records</Menu.Item>
                </Link>
                <Link href="/viewdoctors" legacyBehavior>
                  <Menu.Item as="a">Doctors</Menu.Item>
                </Link>
                <Menu.Item position="right">
                  <Link href="/doctors" legacyBehavior>
                    <Button as="a" inverted={!fixed}>
                      Create
                    </Button>
                  </Link>
                  <Link href="/newdoc" legacyBehavior>
                    <Button
                      as="a"
                      inverted={!fixed}
                      primary={fixed}
                      style={{ marginLeft: "0.5em" }}
                    >
                      Register Doctor
                    </Button>
                  </Link>
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
        </Visibility>
        <Container style={{ marginTop: "10px" }}>
          {this.props.children}
        </Container>
      </Media>
    );
  }
}
export default Layout;
