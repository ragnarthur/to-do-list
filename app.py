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

    return app

app = create_app()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.String(10), nullable=True)
    priority = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(10), default='Pending')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_task():
    data = request.get_json()
    due_date = data['due_date']
    new_task = Task(
        title=data['title'],
        description=data['description'],
        due_date=due_date,
        priority=data['priority'],
        status='Pending'
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task added!'})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    task_list = [{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'priority': task.priority,
        'status': 'Concluída' if task.status == 'Completed' else 'Pendente'
    } for task in tasks]
    return jsonify(task_list)

@app.route('/edit/<int:id>', methods=['PUT'])
def edit_task(id):
    data = request.get_json()
    task = Task.query.get_or_404(id)
    task.title = data['title']
    task.description = data['description']
    task.due_date = data['due_date']
    task.priority = data['priority']
    task.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Task edited!'})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted!'})

@app.route('/toggle-status/<int:id>', methods=['PUT'])
def toggle_task_status(id):
    task = Task.query.get_or_404(id)
    task.status = 'Pending' if task.status == 'Completed' else 'Completed'
    db.session.commit()
    return jsonify({'message': 'Task status toggled!'})

if __name__ == '__main__':
    app.run(debug=True)
