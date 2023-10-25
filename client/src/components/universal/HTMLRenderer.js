import React from 'react';

function HTMLRenderer(props) {
  const htmlContent = props.html
  // Use the dangerouslySetInnerHTML prop to render HTML
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export default HTMLRenderer;