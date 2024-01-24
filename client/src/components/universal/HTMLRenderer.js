import React from 'react';

function HTMLRenderer(props) {
  const { html } = props;
  // eslint-disable-next-line
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default HTMLRenderer;
