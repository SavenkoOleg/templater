import * as React from 'react';

type Props = {
  children?: React.ReactNode
  title: string
};
const WrapperAuth: React.FC<Props> = ({children, title}) => {
  return(
    <section className="py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card border border-light-subtle rounded-3 shadow-sm">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">{title}</h2>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>)
}

export default WrapperAuth;