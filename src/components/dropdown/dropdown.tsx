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
import styles from './dropdown.module.scss';

export type DropdownOption = {
  text: string,
  value: string,
  placeholder?: boolean,
};

type Props = {
  id?: string,
  items: DropdownOption[],
  onSelect?: Function,
  className?: any,
  selected?: string,
  error?: boolean,
  [x:string]: any,
};

export const Dropdown = ({
  id,
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
    <div
      className={cx(
        'control-wrapper',
        styles.dropdownControl,
        { [styles.error]: error },
        className,
      )}
    >
      <ReactstrapDropdown
        className={cx(styles.dropdown, {
          [styles.show]: dropdownOpen,
        })}
        isOpen={dropdownOpen}
        toggle={toggle}
      >
        <DropdownToggle id={id} className={styles.dropdownToggle} color="" caret>
          <span className={styles.buttonText}>{title}</span>
          <Input {...rest} value={selected} type="hidden" />
        </DropdownToggle>
        <DropdownMenu
          className={styles.dropdownMenu}
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
    </div>
  );
};
