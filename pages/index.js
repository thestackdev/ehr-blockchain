import { createMedia } from "@artsy/fresnel";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Visibility,
} from "semantic-ui-react";
import { TransactionContext } from "../context/Entherum";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const HomepageHeading = ({ mobile }) => (
  <Container text>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
      integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ=="
      crossOrigin="anonymous"
    />

    <Header
      as="h1"
      content="MEDBLOCK"
      inverted
      style={{
        fontSize: mobile ? "2em" : "4em",
        fontWeight: "normal",
        marginBottom: 0,
        marginTop: mobile ? "1.5em" : "3em",
      }}
    />
    <Header
      as="h2"
      content="Maintain your health records safely with the help of blockchain"
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: mobile ? "0.5em" : "1.5em",
      }}
    />
    <Link href="/doctors" legacyBehavior>
      <Button primary size="huge">
        Get Started
        <Icon name="right arrow" />
      </Button>
    </Link>
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

function DesktopContainer({ children }) {
  const [fixed, setFixed] = useState(false);

  const hideFixedMenu = () => setFixed(false);
  const showFixedMenu = () => setFixed(true);

  const { manager, currentAccount } = useContext(TransactionContext);

  return (
    <Media greaterThan="mobile">
      <Visibility
        once={false}
        onBottomPassed={showFixedMenu}
        onBottomPassedReverse={hideFixedMenu}
      >
        <Segment
          inverted
          textAlign="center"
          style={{ minHeight: 700, padding: "1em 0em" }}
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
                <Menu.Item as="a">Appointments</Menu.Item>
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
                {currentAccount.toLowerCase() === manager.toLowerCase() && (
                  <Link href="/newdoc" legacyBehavior>
                    <Button
                      inverted={!fixed}
                      primary={fixed}
                      style={{ marginLeft: "0.5em" }}
                    >
                      Register Doctor
                    </Button>
                  </Link>
                )}
              </Menu.Item>
            </Container>
          </Menu>
          <HomepageHeading />
        </Segment>
      </Visibility>
      {children}
    </Media>
  );
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const HomepageLayout = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3" style={{ fontSize: "2em" }}>
              We secure your health records using blockchain technology.
            </Header>
            <p style={{ fontSize: "1.33em" }}>
              Blockchain can transform the way a patient’s electronic health
              records are stored and shared. It can provide a safer, more
              transparent, and traceable underpinning system for health
              information exchange. The technology has the potential to connect
              multiple data management systems working in silos and provide what
              could be a connected and interoperable electronic health record
              system.
            </p>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Image
              bordered
              rounded
              size="large"
              src="https://bafybeie724i7v2re4kdzktcfn35ymwgyep6y4lpckz2rpn4ctpcjfbidnm.ipfs.infura-ipfs.io/"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Link
              href="https://blockgeni.com/electronic-health-records-ehr-on-blockchain/"
              legacyBehavior
            >
              <Button size="huge">Read More</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: "8em 0em" }} vertical>
      <Container text>
        <Header as="h3" style={{ fontSize: "2em" }}>
          Breaking The Grid, Blockchain the future!!
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          We live in an era where technology plays a crucial role in our
          day-to-day activity. For instance, you check the internet, connect to
          online stores to buy groceries and watch your favorite show on
          Netflix. All of these are not possible without the inclusion of
          technology. The numbers are already strong when it comes to
          blockchain. In 2019, the worldwide spending on blockchain technology
          is $2.7 billion. It has already disrupted the finance sector and
          continues to grow in the right direction. Another great statistic is
          the valuation of blockchain in the food and agriculture market — which
          is valued at 41.9m USD.
        </p>
        <Button as="a" size="large">
          Read More
        </Button>
      </Container>
    </Segment>
    <Segment inverted vertical style={{ padding: "5em 0em" }}></Segment>
  </ResponsiveContainer>
);

export default HomepageLayout;
