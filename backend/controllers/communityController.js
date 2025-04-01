const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.create({
      content,
      author: req.user._id,
    });

    const populatedPost = await CommunityPost.findById(post._id).populate(
      'author',
      'name'
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('author', 'name')
      .populate('comments.author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post
// @route   GET /api/community/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      text,
      author: req.user._id,
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('author', 'name')
      .populate('comments.author', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   PUT /api/community/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};