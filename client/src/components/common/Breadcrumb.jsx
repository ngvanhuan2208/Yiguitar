import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ paths = [] }) => {
  return (
    <nav className="mb-10 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
      <Link to="/" className="hover:text-slate-900 transition-colors">YI GUITAR</Link>
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <span className="opacity-30">/</span>
          {path.link ? (
            <Link to={path.link} className="hover:text-slate-900 transition-colors uppercase">
              {path.name}
            </Link>
          ) : (
            <span className="text-slate-900 truncate max-w-[150px] sm:max-w-none uppercase">
              {path.name}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
