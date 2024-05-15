from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/add', methods=['POST'])
    def add_task():
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        due_date = data.get('due_date')
        priority = data.get('priority')
        if not title:
            return jsonify({'error': 'O título não pode estar vazio.'}), 400
        new_task = Task(
            title=title,
            description=description,
            due_date=datetime.strptime(due_date, '%Y-%m-%d') if due_date else None,
            priority=priority
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task added!'})

    @app.route('/tasks', methods=['GET'])
    def get_tasks():
        tasks = Task.query.all()
        task_list = [{'id': task.id, 'title': task.title, 'description': task.description, 'due_date': task.due_date.strftime('%Y-%m-%d') if task.due_date else None, 'priority': task.priority, 'status': task.status} for task in tasks]
        return jsonify(task_list)

    @app.route('/edit/<int:id>', methods=['PUT'])
    def edit_task(id):
        data = request.get_json()
        task = Task.query.get_or_404(id)
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        due_date = data.get('due_date')
        task.due_date = datetime.strptime(due_date, '%Y-%m-%d') if due_date else task.due_date
        task.priority = data.get('priority', task.priority)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify({'message': 'Task edited!'})

    @app.route('/delete/<int:id>', methods=['DELETE'])
    def delete_task(id):
        task = Task.query.get_or_404(id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted!'})

    return app

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    due_date = db.Column(db.Date)
    priority = db.Column(db.String(50))
    status = db.Column(db.String(50), default='Pending')

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
