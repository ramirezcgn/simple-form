import React from 'react';
import {
  FormGroup as ReactStrapFormGroup,
  FormFeedback,
  Label,
} from 'reactstrap';
import cx from 'classnames';
import styles from './form-group.module.scss';

type Props = {
  for?: string,
  label?: string,
  error?: string,
  children?: any,
  className?: any,
  childrenPos?: ('after' | 'before'),
  [x:string]: any,
};

export const FormGroup = ({
  for: htmlFor,
  label,
  error,
  children,
  className = '',
  childrenPos,
  ...rest
}: Props) => {
  return (
    <ReactStrapFormGroup
      {...rest}
      className={cx(
        styles.formGroupControl,
        { [styles[childrenPos || '']]: childrenPos },
        className,
      )}
    >
      {error && (
        <FormFeedback>
          {error}
        </FormFeedback>
      )}
      {label && (
        <Label for={htmlFor}>
          {childrenPos === 'before' && children}
          <span className={styles.labelText}>{label}</span>
          {childrenPos === 'after' && children}
        </Label>
      )}
      {!childrenPos && children}
    </ReactStrapFormGroup>
  );
};
