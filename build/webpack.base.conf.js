const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    pages_dir: path.join(__dirname, '../src/pages'),
    assets: 'assets',
};

const html_pages = fs.readdirSync(`${paths.pages_dir}/html`);

module.exports = {
    externals: {
        paths: paths
    },
    entry: {
        app: paths.src
    },
    output: {
        filename: `${paths.assets}/js/[name].[hash].js`,
        path: paths.dist,
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader?url=false',
                        options: { sourceMap: true, url: false }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.html$/,
                include: `${paths.pages_dir}/includes`,
                use: ['raw-loader']
            }
        ],
    },
    resolve: {
        alias: {
            styles: `${paths.src}/assets/scss`,
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `${paths.assets}/css/[name].[hash].css`,
        }),
        new CopyWebpackPlugin([
            { from: `${paths.src}/${paths.assets}/img`, to: `${paths.assets}/img` },
            { from: `${paths.src}/${paths.assets}/fonts`, to: `${paths.assets}/fonts` },
            { from: `${paths.src}/static`, to: '' },
        ]),
        ...html_pages.map(page => new HtmlWebpackPlugin({
            template: `${paths.pages_dir}/html/${page}`,
            filename: `./${page}`,
            inject: false,
        }))
    ],
};
