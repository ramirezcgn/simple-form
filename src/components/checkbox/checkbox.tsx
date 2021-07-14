import React from 'react';
import { Input } from 'reactstrap';
import cx from 'classnames';
import styles from './checkbox.module.scss';

type Props = {
  className?: any,
  error?: boolean,
  [x:string]: any,
};

export const Checkbox = ({
  className = '',
  error = false,
  ...rest
}: Props) => {
  return (
    <div
      className={cx(
        'control-wrapper',
        styles.checkboxControl,
        { error },
        className,
      )}
    >
      <Input {...rest} type="checkbox" />
      <span />
    </div>
  );
};
