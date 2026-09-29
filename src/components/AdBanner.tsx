import React from 'react';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const desktopAdDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : 'f3b903347568ac4ef4be6c7e57bcd36f',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://celerycribbanish.com/f3b903347568ac4ef4be6c7e57bcd36f/invoke.js"></script>
      </body>
    </html>
  `;

  const mobileAdDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '9c559d0bec5b12842c8742d00e2aea00',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://celerycribbanish.com/9c559d0bec5b12842c8742d00e2aea00/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden select-none ${className}`}>
      {/* Desktop 728x90 Adsterra Banner */}
      <div className="hidden md:flex items-center justify-center w-full max-w-[730px] min-h-[92px] p-0.5 rounded-lg bg-slate-50/70 border border-slate-200/80 shadow-xs">
        <iframe
          title="Sponsored Advertisement"
          srcDoc={desktopAdDoc}
          width={728}
          height={90}
          className="border-0 overflow-hidden block"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          scrolling="no"
        />
      </div>

      {/* Mobile 320x50 Adsterra Banner */}
      <div className="flex md:hidden items-center justify-center w-full max-w-[324px] min-h-[52px] p-0.5 rounded-lg bg-slate-50/70 border border-slate-200/80 shadow-xs">
        <iframe
          title="Sponsored Advertisement Mobile"
          srcDoc={mobileAdDoc}
          width={320}
          height={50}
          className="border-0 overflow-hidden block"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          scrolling="no"
        />
      </div>
    </div>
  );
};
