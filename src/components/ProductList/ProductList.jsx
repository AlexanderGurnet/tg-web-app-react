import React, { useState, useEffect, useCallback } from 'react';

import ProductItem from '../ProductItem/ProductItem';

import { useTelegram } from '../../hooks/useTelegram';

import './ProductList.css';

const products = [
  { id: '1', title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые' },
  { id: '2', title: 'Куртка', price: 12000, description: 'Красного цвета, оверсайз' },
  { id: '3', title: 'Брюки', price: 8000, description: 'Желтого цвета, прямые' },
  { id: '4', title: 'Футболка', price: 9000, description: 'Синего цвета, слим' },
  { id: '5', title: 'Трусы', price: 3000, description: 'Белого цвета, боксеры' },
  { id: '6', title: 'Ботинки', price: 7000, description: 'Черного цвета, челси' },
  { id: '7', title: 'Шапка', price: 5500, description: 'Зеленого цвета, зимняя' },
  { id: '8', title: 'Джинсы 2', price: 3900, description: 'Белого цвета, прямые' },
];

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);
};

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const { tg, queryId } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      products: addedItems,
      totalPrice: getTotalPrice(addedItems),
      queryId,
    };

    fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }, [addedItems, queryId]);

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);
    return () => {
      tg.offEvent('mainButtonClicked', onSendData);
    };
  }, [tg, onSendData]);

  const onAdd = (product) => {
    const alreadyAdded = addedItems.find((item) => item.id === product.id);
    let newItems = [];

    if (alreadyAdded) {
      newItems = addedItems.filter((item) => item.id !== product.id);
    } else {
      newItems = [...addedItems, product];
    }

    setAddedItems(newItems);

    if (newItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить ${getTotalPrice(newItems)}`,
      });
    }
  };

  return (
    <div className={'list'}>
      {products.map((item) => (
        <ProductItem product={item} onAdd={onAdd} className={'item'} />
      ))}
    </div>
  );
};

export default ProductList;
