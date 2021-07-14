import React, { useState, useMemo, useCallback } from 'react';
import {
  Dropdown as ReactstrapDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from 'reactstrap';
import CustomScroll from 'react-custom-scroll';
import cx from 'classnames';
import styles from './dropdown.scss';

export type DropdownOption = {
  text: string,
  value: string,
  placeholder?: boolean,
};

type Props = {
  items: DropdownOption[],
  onSelect?: Function,
  className?: any,
  selected?: string,
  error?: boolean,
  [x:string]: any,
};

export const Dropdown = ({
  items,
  onSelect,
  className = '',
  selected: initialSelected = '',
  error = false,
  ...rest
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  const toggle = useCallback(() => {
    setDropdownOpen((d: boolean) => !d);
  }, []);

  const onClick = useCallback((event: any) => {
    const {
      currentTarget: {
        dataset: { value },
      },
    } = event;
    const item = items.find(({ value: itemValue }) => (
      value === itemValue
    ));
    if (!item) {
      return;
    }
    setSelected(value);
    if (onSelect) {
      onSelect(value);
    }
  }, [items, onSelect]);

  if (!Array.isArray(items)) {
    return null;
  }

  const { text: title } = useMemo(() => items.find(({ value }) => (
    selected === value
  )) || { text: '' }, [items, selected]);

  return (
    <ReactstrapDropdown
      className={cx(
        'control-wrapper',
        styles.dropdownControl,
        { error },
        className,
      )}
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle color="" caret>
        <span className={styles.buttonText}>{title}</span>
        <Input {...rest} value={selected} type="hidden" />
      </DropdownToggle>
      <DropdownMenu
        // right={menuRightAligned}
        modifiers={{
          setStyles: {
            enabled: true,
            order: 890,
            fn: (data: any) => {
              return {
                ...data,
                styles: {
                  ...data.styles,
                  overflow: 'auto',
                  maxWidth: '95vw',
                },
              };
            },
          },
        }}
        // flip={!menuDisableFlip}
      >
        <CustomScroll heightRelativeToParent="100%">
          {items
            .filter(({ placeholder }) => !placeholder)
            .map<any>(({ text, value }) => (
              <DropdownItem
                className={cx(styles.dropdownItem, {
                  [styles.selected]: selected === value,
                })}
                onClick={onClick}
                data-value={value}
                key={value}
              >
                {text}
              </DropdownItem>
            ))}
        </CustomScroll>
      </DropdownMenu>
    </ReactstrapDropdown>
  );
};
