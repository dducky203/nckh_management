import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      title: 'Hiện đại',
      description: 'Được xây dựng với các công nghệ React và Tailwind CSS mới nhất',
      icon: '⚡'
    },
    {
      title: 'Responsive',
      description: 'Hoạt động mượt mà trên mọi thiết bị và kích thước màn hình',
      icon: '📱'
    },
    {
      title: 'Tối ưu',
      description: 'Được tối ưu hóa cho hiệu suất và trải nghiệm người dùng tốt nhất',
      icon: '🚀'
    }
  ];

  const stats = [
    { label: 'Người dùng', value: '10,000+' },
    { label: 'Đánh giá', value: '4.9/5' },
    { label: 'Dự án', value: '500+' },
    { label: 'Năm kinh nghiệm', value: '5+' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Chào mừng đến với{' '}
              <span className="text-blue-600">MyApp</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ứng dụng web hiện đại được xây dựng với React, Tailwind CSS và các công nghệ tiên tiến nhất. 
              Trải nghiệm giao diện đẹp mắt và hiệu suất tối ưu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => console.log('Bắt đầu ngay')}>
                Bắt đầu ngay
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/about">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600">Khám phá những tính năng tuyệt vời của ứng dụng</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tham gia cùng chúng tôi và khám phá những tính năng tuyệt vời
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Đăng ký miễn phí
            </Button>
            <Button variant="secondary" size="lg">
              <Link to="/contact">Liên hệ chúng tôi</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;