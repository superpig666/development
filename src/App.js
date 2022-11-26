import "./App.css";
import { useState } from "react";
import { Card, Button, Radio, Layout, Col, Row, Space } from "antd";
import bakeryData from "./assets/bakery-data.json";


const { Header, Content, Footer, Sider } = Layout;

/* ####### DO NOT TOUCH -- this makes the image URLs work ####### */
bakeryData.forEach((item) => {
  item.image = process.env.PUBLIC_URL + "/" + item.image;
});
/* ############################################################## */
function DisplayList(props) {
  const { list } = props;
  return (
    <Row>
      {list.map((item, index) => {
        return (
          <Col md={8} xxl={6} sm={12} xs={24}>
            <Card
              // hoverable
              cover={<img alt={item.name} src={item.image} />}
              actions={[
                <Button type="primary" onClick={() => props.addGoods(item)}>
                  Add to Cart
                </Button>,
              ]}
            >
              <p className="card-name">{item.name}</p>
              <p>Calories: {item.calories}</p>
              <p>{item.flavor} {item.type}</p>
              <p style={{ fontWeight: 800 }}>{`$${item.price}`}</p>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

function CartList(props) {
  const { list, cart } = props;
  return (
    <div className="display-container">
      {list.map((item, index) => {
        if (cart[item.name] > 0) {
          return (
            <div>
              <p>{item.name} * {cart[item.name]}</p>
              <Button danger size="small" onClick={() => props.removeFromCart(item)}>
                Remove from Cart
              </Button>
            </div>
          )
        }
      })}
    </div>
  );
}

function App() {
  // TODO: use useState to create a state variable to hold the state of the cart
  /* add your cart state code here */

  const [cart, setCart] = useState(new Map())
  const [totalCost, setTotalCost] = useState(0)
  const [typeSelect, setType] = useState("All Type")
  const [flavorSelect, setFlavor] = useState("All Flavor")
  const [sortBy, setSort] = useState("Price")


  //AddToCart function
  const addToCart = (item) => {
    setTotalCost(totalCost + item.price);

    setCart((prevCart) => {
      const newCart = { ...prevCart };
      newCart[item.name] = (newCart[item.name] || 0) + 1;
      return newCart
    });
  }

  const removeFromCart = (item) => {
    setTotalCost(totalCost - item.price);

    setCart((prevCart) => {
      const newCart = { ...prevCart };
      newCart[item.name] = newCart[item.name] - 1;
      return newCart
    });
  }

  const onTypeChange = (e) => {
    setType(e.target.value);
  };

  const onFlavorChange = (e) => {
    setFlavor(e.target.value);
  };

  const onSortChange = (e) => {
    setSort(e.target.value);
  };

  const matchesFilterSize = (item) => {
    if (typeSelect == "All Type" && flavorSelect == "All Flavor") {
      return true;
    } else if (typeSelect == "All Type") {
      return item.flavor == flavorSelect;
    } else if (flavorSelect == "All Flavor") {
      return item.type == typeSelect;
    } else {
      return item.type == typeSelect && item.flavor == flavorSelect;
    }
  };

  const sortFilter = (a, b) => {
    if (sortBy === "Price") {
      return a.price - b.price;
    } else if (sortBy === "Calories") {
      return a.calories - b.calories;
    }
  };


  return (
    <div className="App">

      <h1>My Bakery</h1>
      <div className="Body">
        <p>
          <Space>Flavor Select:
            <Radio.Group onChange={onFlavorChange} value={flavorSelect}>
              <Radio value="All Flavor">All Flavor</Radio>
              <Radio value="sweet">Sweet</Radio>
              <Radio value="salty">Salty</Radio>
              <Radio value="sour">Sour</Radio>
            </Radio.Group>
          </Space>
        </p>
        <p>
          <Space>Type Select:
            <Radio.Group onChange={onTypeChange} value={typeSelect}>
              <Radio value="All Type">All Type</Radio>
              <Radio value="pastry">Pastry</Radio>
              <Radio value="cake">Cake</Radio>
              <Radio value="bread">Bread</Radio>
            </Radio.Group>
          </Space>
        </p>
        <p>
          <Space>Sort by:
            <Radio.Group onChange={onSortChange} value={sortBy}>
              <Radio value="Price">Price</Radio>
              <Radio value="Calories">Calories</Radio>
            </Radio.Group>
          </Space>
        </p>
        <Layout>
          <Content>
            <DisplayList list={bakeryData.filter(matchesFilterSize).sort(sortFilter)} addGoods={addToCart} />
          </Content>
          <Sider theme="light" width="20%">
            <h2>Cart</h2>
            Total cost: {totalCost}
            <h3>Items</h3>
            <CartList list={bakeryData} cart={cart} removeFromCart={removeFromCart} />
          </Sider>
        </Layout>
      </div>

    </div>
  );
}

export default App;